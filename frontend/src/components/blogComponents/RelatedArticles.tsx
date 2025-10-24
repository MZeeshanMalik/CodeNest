interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl?: string;
}

interface RelatedArticlesProps {
  articles: Article[];
}

const RelatedArticles = ({ articles }: RelatedArticlesProps) => {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold mb-8">Related Articles</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <article
            key={article.id}
            className="flex flex-col rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
          >
            {/* Image Container */}
            <div className="relative pt-[56.25%]">
              {" "}
              {/* 16:9 aspect ratio */}
              {article.imageUrl && (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              )}
              {!article.imageUrl && (
                <div className="absolute top-0 left-0 w-full h-full bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Content Container */}
            <div className="flex flex-col flex-grow p-6">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                {article.title}
              </h3>

              <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                {article.excerpt}
              </p>

              <div className="mt-auto">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span className="font-medium">{article.author}</span>
                  <span>{article.date}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-600">{article.readTime}</span>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Read more →
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;
