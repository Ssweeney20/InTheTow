import React from 'react'
import { Search as SearchIcon } from 'lucide-react'

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className='w-full max-w-2xl mx-auto mt-8'>
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input 
          type='text'
          placeholder='Search facilities by name, city, or company...'
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none text-lg placeholder:text-gray-500 transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export default Search