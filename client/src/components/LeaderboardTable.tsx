import { LeaderboardEntry } from "@/lib/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  isWeekly?: boolean;
}

export function LeaderboardTable({ entries, isWeekly = false }: LeaderboardTableProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  
  const totalPages = Math.ceil(entries.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const visibleEntries = entries.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  
  // Generate an array with page numbers
  const pageNumbers = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Show first page, current page, and last page
    pageNumbers.push(1);
    if (page > 2) pageNumbers.push('...');
    if (page !== 1 && page !== totalPages) pageNumbers.push(page);
    if (page < totalPages - 1) pageNumbers.push('...');
    pageNumbers.push(totalPages);
  }

  const getMedalIcons = (medals: number) => {
    const icons = [];
    for (let i = 0; i < 3; i++) {
      icons.push(
        <i 
          key={i}
          className={`fas fa-medal ${i < medals ? 'text-yellow-500' : 'text-gray-400'}`}
        ></i>
      );
    }
    return icons;
  };

  return (
    <div className="bg-background rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div className="px-6 py-4 bg-primary text-white flex justify-between items-center">
        <h3 className="font-semibold">Melhores Competidores</h3>
        <div className="flex gap-2">
          <Button 
            variant={isWeekly ? "default" : "outline"} 
            size="sm" 
            className={isWeekly ? "bg-white/20 hover:bg-white/30 text-white" : "bg-white text-primary"}
          >
            Esta Semana
          </Button>
          <Button 
            variant={!isWeekly ? "default" : "outline"} 
            size="sm" 
            className={!isWeekly ? "bg-white/20 hover:bg-white/30 text-white" : "bg-white text-primary"}
          >
            Geral
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Posição</th>
              <th className="px-6 py-3">Competidor</th>
              <th className="px-6 py-3">Instituição</th>
              <th className="px-6 py-3">Pontos</th>
              <th className="px-6 py-3">Desafios Completos</th>
              <th className="px-6 py-3">Medalhas</th>
            </tr>
          </thead>
          <tbody>
            {visibleEntries.map((entry, index) => (
              <tr key={entry.id} className="bg-white border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">
                  <div className="flex items-center">
                    <span className={`
                      ${index === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'} 
                      w-8 h-8 rounded-full flex items-center justify-center mr-2 font-bold
                    `}>
                      {startIndex + index + 1}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img 
                      className="w-8 h-8 rounded-full mr-3" 
                      src={entry.user.avatarUrl || `https://ui-avatars.com/api/?name=${entry.user.name}`} 
                      alt={entry.user.name}
                    />
                    <div>
                      <div className="font-medium">{entry.user.name}</div>
                      <div className="text-gray-500 text-xs">@{entry.user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{entry.user.institution || "N/A"}</td>
                <td className="px-6 py-4 font-bold text-primary">
                  {isWeekly ? entry.weeklyPoints : entry.totalPoints}
                </td>
                <td className="px-6 py-4">{entry.challengesCompleted}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-1">
                    {getMedalIcons(entry.medals)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <button 
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="text-gray-500 hover:text-gray-700 transition flex items-center gap-1 disabled:opacity-50"
        >
          <i className="fas fa-chevron-left"></i> Anterior
        </button>
        <div className="flex gap-1">
          {pageNumbers.map((num, i) => (
            typeof num === 'number' ? (
              <button 
                key={i}
                onClick={() => setPage(num)}
                className={`
                  ${page === num ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-200'} 
                  w-8 h-8 rounded-full transition
                `}
              >
                {num}
              </button>
            ) : (
              <span key={i} className="text-gray-500 flex items-center justify-center w-8">
                {num}
              </span>
            )
          ))}
        </div>
        <button 
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="text-primary hover:text-primary/80 transition flex items-center gap-1 disabled:opacity-50"
        >
          Próximo <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}
