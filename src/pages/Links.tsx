import React from 'react';

function Links() {
  const links = [
    { name: 'Nanoka HSR', url: 'https://hsr.nanoka.cc', domain: 'hsr.nanoka.cc' },
    { name: 'Gachabase HSR', url: 'https://hsr.gachabase.net', domain: 'hsr.gachabase.net' },
    { name: 'Huroka', url: 'https://www.huroka.com', domain: 'www.huroka.com' },
  ];

  return (
    <div className="w-full md:w-1/2 mx-auto bg-gray-800 rounded-lg shadow p-6 flex flex-col">
      <div className="flex flex-col gap-5">
        {links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gray-700 hover:bg-gray-600 rounded-lg py-8 px-6 text-center transition-colors duration-200 shadow-md group"
          >
            <div className="text-gray-100 font-bold text-3xl mb-2 group-hover:text-white">
              {link.name}
            </div>
            <div className="text-gray-400 text-base truncate">
              {link.domain}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Links;