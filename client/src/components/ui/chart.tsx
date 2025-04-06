import React from 'react';

interface ChartProps {
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  };
  options?: Record<string, any>;
}

export function Chart({ type, data, options }: ChartProps) {
  // This is a simplified chart component for demonstration
  // In a real application, we would use a chart library like Chart.js or Recharts
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full">
        {type === 'bar' && (
          <div className="space-y-4">
            {data.datasets.map((dataset, datasetIndex) => (
              <div key={datasetIndex}>
                <p className="text-sm font-medium mb-2">{dataset.label}</p>
                <div className="grid grid-cols-1 gap-2">
                  {data.labels.map((label, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-24 text-xs truncate mr-2">{label}</div>
                      <div className="flex-1 bg-gray-200 h-5 rounded-md">
                        <div
                          className="bg-blue-500 h-5 rounded-md"
                          style={{
                            width: `${Math.min(100, (dataset.data[index] / Math.max(...dataset.data)) * 100)}%`,
                            backgroundColor: Array.isArray(dataset.backgroundColor)
                              ? dataset.backgroundColor[index]
                              : dataset.backgroundColor,
                          }}
                        />
                      </div>
                      <div className="w-12 text-xs text-right ml-2">{dataset.data[index]}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {type === 'line' && (
          <div className="flex items-end h-40 mt-4 space-x-2">
            {data.labels.map((label, index) => {
              const values = data.datasets.map(dataset => dataset.data[index]);
              const maxValue = Math.max(...data.datasets.flatMap(dataset => dataset.data));
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="flex flex-col-reverse w-full">
                    {data.datasets.map((dataset, datasetIndex) => (
                      <div
                        key={datasetIndex}
                        className="w-full"
                        style={{
                          height: `${(dataset.data[index] / maxValue) * 100}%`,
                          backgroundColor: Array.isArray(dataset.backgroundColor)
                            ? dataset.backgroundColor[index]
                            : dataset.backgroundColor || '#3B82F6',
                          minHeight: '4px',
                        }}
                      />
                    ))}
                  </div>
                  <div className="text-xs mt-1 truncate w-full text-center">{label}</div>
                </div>
              );
            })}
          </div>
        )}
        
        {(type === 'pie' || type === 'doughnut') && (
          <div className="flex flex-col items-center">
            <div className={`relative w-40 h-40 rounded-full overflow-hidden ${type === 'doughnut' ? 'flex items-center justify-center' : ''}`}>
              {type === 'doughnut' && (
                <div className="absolute w-20 h-20 bg-white rounded-full z-10"></div>
              )}
              <div className="absolute inset-0">
                {data.datasets[0].data.map((value, index) => {
                  const total = data.datasets[0].data.reduce((sum, val) => sum + val, 0);
                  const startAngle = data.datasets[0].data
                    .slice(0, index)
                    .reduce((sum, val) => sum + (val / total) * 360, 0);
                  const angle = (value / total) * 360;
                  
                  const backgroundColor = Array.isArray(data.datasets[0].backgroundColor)
                    ? data.datasets[0].backgroundColor[index]
                    : data.datasets[0].backgroundColor || '#3B82F6';
                  
                  return (
                    <div
                      key={index}
                      className="absolute inset-0"
                      style={{
                        backgroundColor,
                        clipPath: `conic-gradient(from ${startAngle}deg, ${backgroundColor} ${angle}deg, transparent ${angle}deg)`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {data.labels.map((label, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-sm mr-2"
                    style={{
                      backgroundColor: Array.isArray(data.datasets[0].backgroundColor)
                        ? data.datasets[0].backgroundColor[index]
                        : data.datasets[0].backgroundColor,
                    }}
                  />
                  <span className="text-xs truncate">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}