// SectionHeader.jsx (Updated)
export default function SectionHeader({ title, count, description }) {
  return (
    <div className="relative mb-8  border-b border-gray-200/60">
      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight dark:text-white">
                {title}
              </h1>
              {count !== undefined && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium text-gray-500">Total Patterns:</span>
                  <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-2 py-1 rounded-full dark:bg-blue-200 dark:text-blue-800">
                    {count}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {description && (
            <p className="text-gray-600 text-base max-w-2xl leading-relaxed ml-5">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}




