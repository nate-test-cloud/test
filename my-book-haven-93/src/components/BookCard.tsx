import { Star, BookmarkPlus } from "lucide-react";

interface BookCardProps {
  cover: string;
  title: string;
  author: string;
  rating: number;
}

const BookCard = ({ cover, title, author, rating }: BookCardProps) => {
  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border/40 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-primary/8 hover:border-primary/20 hover:-translate-y-2">
      <div className="aspect-[2/3] overflow-hidden relative">
        <img
          src={cover}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

        {/* Bookmark button */}
        <button className="absolute top-3 right-3 h-8 w-8 rounded-lg bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-400 hover:bg-primary hover:text-primary-foreground text-muted-foreground shadow-lg">
          <BookmarkPlus className="h-4 w-4" />
        </button>

        {/* View details label */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
          <span className="inline-block px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-lg shadow-primary/30 tracking-wide">
            View Details
          </span>
        </div>
      </div>
      <div className="p-4 space-y-1.5 transition-all duration-300 group-hover:bg-primary/[0.03]">
        <h3 className="font-semibold text-card-foreground text-[13px] leading-tight line-clamp-1 transition-colors duration-300 group-hover:text-primary">
          {title}
        </h3>
        <p className="text-muted-foreground text-xs tracking-wide">{author}</p>
        <div className="flex items-center gap-0.5 pt-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 transition-all duration-300 ${
                i < rating
                  ? "fill-star text-star group-hover:scale-110"
                  : "fill-muted text-muted"
              }`}
              style={{ transitionDelay: `${i * 40}ms` }}
            />
          ))}
          <span className="text-[11px] text-muted-foreground ml-1.5 font-medium">{rating}.0</span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
