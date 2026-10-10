import sys, subprocess, numpy as np
def load(p, ss=None, t=None):
    cmd=['ffmpeg','-v','error']+(['-ss',str(ss)] if ss is not None else [])+(['-t',str(t)] if t else [])+['-i',p,'-ac','1','-ar','16000','-f','s16le','-']
    return np.frombuffer(subprocess.run(cmd,capture_output=True).stdout,np.int16).astype(float)
def f0s(a):
    out=[]; w=640
    for i in range(0,len(a)-w,160):
        s=a[i:i+w]; s=s-s.mean()
        if np.sqrt((s**2).mean())<1500: continue
        c=np.correlate(s,s,'full')[w-1:]; lo,hi=16000//350,16000//70
        k=lo+np.argmax(c[lo:hi]); 
        if c[k]>0.45*c[0]: out.append(16000/k)
    return np.array(out)
for p,ss,t in [(sys.argv[1],0,20),(sys.argv[2],None,None)]:
    f=f0s(load(p,ss,t)); print(p, len(f), 'p10/50/90 Hz', np.percentile(f,[10,50,90]).round())
