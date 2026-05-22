import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';

export function Dashboard() {
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const result = window.sessionStorage.getItem('edvinci_result');
    if (!result) {
      navigate('/');
      return;
    }
    setData(JSON.parse(result));
  }, [navigate]);

  if (!data) return null;

  const { identity, stack, dayOne } = data;

  return (
    <Layout>
      <div className="p-margin-mobile md:p-margin-desktop max-w-[1440px] mx-auto w-full flex-1">
        <header className="mb-12">
          <h1 className="text-display-lg font-display-lg mb-2">Activation Command Center</h1>
          <p className="text-body-lg text-on-surface-variant">Your progress is being mapped in real-time.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-bento-gap">
          {/* Identity Snapshot */}
          <Link to="/identity" className="md:col-span-8 bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-8 hover:border-primary/50 transition-all relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <span className="text-label-caps font-label-caps text-primary mb-4 block">CURRENT IDENTITY</span>
              <h2 className="text-display-sm font-display-sm text-white mb-4 uppercase tracking-tighter">
                {identity.oneLineIdentity}
              </h2>
              <p className="text-body-md text-on-surface-variant max-w-xl">
                {identity.reasoning}
              </p>
            </div>
          </Link>

          {/* Quick Action */}
          <Link to="/path" className="md:col-span-4 bg-primary rounded-2xl p-8 hover:scale-[1.02] transition-all flex flex-col justify-between">
            <div>
              <span className="material-symbols-outlined text-white text-4xl mb-4">bolt</span>
              <h3 className="text-headline-md font-headline-md text-white mb-2">Day 1 Action</h3>
              <p className="text-white/80">{dayOne.dayOneAction}</p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-white font-bold">
              Complete Now <span className="material-symbols-outlined">arrow_forward</span>
            </div>
          </Link>

          {/* Tool Stack */}
          <Link to="/identity" className="md:col-span-6 bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-8 hover:border-primary/50 transition-all">
            <span className="text-label-caps font-label-caps text-on-surface-variant mb-6 block">PRIMARY ENGINE</span>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">build</span>
              </div>
              <div>
                <h4 className="text-headline-sm font-headline-sm text-white">{stack.primaryTool}</h4>
                <p className="text-body-md text-on-surface-variant">Selected for your {identity.offerType} profile.</p>
              </div>
            </div>
          </Link>

          {/* Progress Tracker */}
          <div className="md:col-span-6 bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-8">
            <span className="text-label-caps font-label-caps text-on-surface-variant mb-6 block">30-DAY VELOCITY</span>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-label-caps font-label-caps mb-2">
                  <span className="text-white">Overall Completion</span>
                  <span className="text-primary">3%</span>
                </div>
                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[3%]"></div>
                </div>
              </div>
              <div className="flex justify-between items-center py-4 border-t border-[#1F1F1F]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-500 text-sm">check</span>
                  </div>
                  <span className="text-body-md text-white">Activation Ritual</span>
                </div>
                <span className="text-label-caps font-label-caps text-green-500">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
