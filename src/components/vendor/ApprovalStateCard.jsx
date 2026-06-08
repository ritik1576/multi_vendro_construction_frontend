import { AlertCircle, Clock, ShieldAlert } from 'lucide-react';

const ApprovalStateCard = ({ state }) => {
  const isPending = state === 'pending';
  const isRejected = state === 'rejected';

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg transition-all">
        {/* Icon & Progress Line */}
        <div className="mx-auto flex flex-col items-center justify-center">
          {isPending && (
            <>
              <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-orange-50 text-[#F97316]">
                <Clock className="h-8 w-8" />
              </div>
              <div className="mb-6 h-1 w-24 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-[#F97316]"></div>
              </div>
            </>
          )}
          {isRejected && (
            <div className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-600">
              <ShieldAlert className="h-8 w-8" />
            </div>
          )}
        </div>

        {/* Text Content */}
        {isPending && (
          <>
            <h2 className="text-2xl font-extrabold text-[#0F172A]">Application Under Review</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-500">
              Dashboard controls will unlock after account activation by our compliance team.
            </p>
            <div className="mt-8 rounded-lg bg-slate-50 p-4">
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-700">
                <AlertCircle className="h-4 w-4 text-[#F97316]" />
                Estimated review time: 24–48 hours
              </div>
            </div>
          </>
        )}

        {isRejected && (
          <>
            <h2 className="text-2xl font-extrabold text-[#0F172A]">Access Denied: Application Rejected</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-500">
              We are unable to approve your vendor application due to missing compliance documentation.
            </p>
            <div className="mt-8">
              <button className="min-h-11 w-full rounded-lg bg-red-600 px-4 py-2 font-extrabold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2">
                Contact Support
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ApprovalStateCard;
