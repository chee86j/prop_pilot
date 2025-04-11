import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight, Star, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { testimonials } from "../utils/testimonialsData";
import { calculateAverageRating, isHomePage } from "../utils/testimonialUtils";

// Rating stars component
const RatingStars = ({ rating }) => {
  return (
    <div className="flex items-center mb-2">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          } mr-1`}
        />
      ))}
      <span className="text-sm text-gray-500 ml-1">{rating}.0</span>
    </div>
  );
};

RatingStars.propTypes = {
  rating: PropTypes.number.isRequired,
};

// Modern Design Testimonial Card
const TestimonialCard = ({
  text,
  author,
  role,
  rating,
  image,
  featured = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        testimonial p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer
        ${
          featured
            ? "bg-gradient-to-br from-green-50 to-blue-50 border-l-4 border-green-500"
            : "bg-white hover:bg-gray-50"
        }
        transform hover:-translate-y-1 flex flex-col h-full
      `}
    >
      <div className="flex-grow mb-4">
        <div className="flex items-center justify-between mb-4">
          <RatingStars rating={rating} />
          <MessageSquare size={20} className="text-green-500 opacity-60" />
        </div>

        <p className="text-gray-700 italic mb-4 line-clamp-3 sm:line-clamp-4">
          &ldquo;{text}&rdquo;
        </p>
      </div>

      <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
        <div className="flex-shrink-0 mr-3">
          {image ? (
            <img
              src={image}
              alt={author}
              className="h-12 w-12 rounded-full object-cover border-2 border-green-100"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
              {author.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="text-gray-800 font-semibold">{author}</p>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
};

TestimonialCard.propTypes = {
  text: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  image: PropTypes.string,
  featured: PropTypes.bool,
  onClick: PropTypes.func,
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const parallaxRef = useRef(null);
  const isOnHomePage = isHomePage();

  // Parallax scroll effect
  useEffect(() => {
    if (!isOnHomePage) {
      const handleScroll = () => {
        if (parallaxRef.current) {
          setScrollY(window.scrollY);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isOnHomePage]);

  const goToPrevious = useCallback(() => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  // Auto-play functionality so the testimonials change every 6 seconds
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(goToNext, 6000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext]);

  // Special layout for homepage integration
  if (isOnHomePage) {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6 md:mb-10">
        <div className="p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-700 mb-6 md:mb-8 relative">
            <span className="relative inline-block">
              What Our Clients Say
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-green-500"></div>
            </span>
          </h2>

          {/* Featured testimonial */}
          <div className="mb-8">
            <TestimonialCard
              text={testimonials[activeIndex].text}
              author={testimonials[activeIndex].author}
              role={testimonials[activeIndex].role}
              rating={testimonials[activeIndex].rating}
              image={testimonials[activeIndex].image}
              featured={true}
            />
          </div>

          {/* Controls for navigation */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full bg-gray-100 hover:bg-green-100 transition-colors duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>

            <div className="text-center px-4 py-2">
              <span className="text-sm text-gray-500 font-medium">
                {activeIndex + 1} of {testimonials.length}
              </span>
            </div>

            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-gray-100 hover:bg-green-100 transition-colors duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          </div>

          {/* Grid of additional testimonials */}
          <div className="hidden md:grid md:grid-cols-3 gap-4">
            {testimonials
              .filter((_, index) => index !== activeIndex)
              .slice(0, 9)
              .map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  text={testimonial.text}
                  author={testimonial.author}
                  role={testimonial.role}
                  rating={testimonial.rating}
                  image={testimonial.image}
                  onClick={() => {
                    setActiveIndex(
                      testimonials.findIndex(
                        (t) => t.author === testimonial.author
                      )
                    );
                    setIsAutoPlaying(false);
                  }}
                />
              ))}
          </div>

          {/* Testimonial stats */}
          <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">98%</div>
              <div className="text-sm text-gray-600">Customer Satisfaction</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">2,500+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {calculateAverageRating(testimonials)}
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">42%</div>
              <div className="text-sm text-gray-600">Efficiency Increase</div>
            </div>
          </div>

          {/* View all testimonials link */}
          <div className="text-center mt-8">
            <Link
              to="/testimonials"
              className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
            >
              View All Testimonials
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Full parallax view for dedicated testimonials page
  return (
    <div className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 relative">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 relative">
          <span className="relative">
            What Our Clients Say
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-green-500 mt-2"></div>
          </span>
        </h2>

        {/* Controls for navigation - making them float over content */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={goToPrevious}
            className="p-2 rounded-full bg-white shadow-md hover:bg-green-100 transition-colors duration-200 z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>

          <div className="text-center px-4 py-2 bg-white rounded-full shadow-md">
            <span className="text-sm text-gray-500 font-medium">
              {activeIndex + 1} of {testimonials.length}
            </span>
          </div>

          <button
            onClick={goToNext}
            className="p-2 rounded-full bg-white shadow-md hover:bg-green-100 transition-colors duration-200 z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>
        </div>

        <div className="stats-banner mb-10 p-6 bg-white rounded-xl shadow-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600">2,500+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600">
                {calculateAverageRating(testimonials)}
              </div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600">42%</div>
              <div className="text-gray-600">Efficiency Increase</div>
            </div>
          </div>
        </div>

        {/* Featured testimonial */}
        <div className="mb-10 transform transition-all duration-500">
          <TestimonialCard
            text={testimonials[activeIndex].text}
            author={testimonials[activeIndex].author}
            role={testimonials[activeIndex].role}
            rating={testimonials[activeIndex].rating}
            image={testimonials[activeIndex].image}
            featured={true}
          />
        </div>

        {/* Selection dots for mobile */}
        <div className="flex justify-center flex-wrap mb-8 max-w-full overflow-x-auto md:hidden">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index);
                setIsAutoPlaying(false);
              }}
              className={`h-3 w-3 mx-1 mb-1 rounded-full transition-colors duration-200 ${
                index === activeIndex
                  ? "bg-green-500"
                  : "bg-gray-300 hover:bg-green-300"
              }`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>

        <div ref={parallaxRef} className="relative">
          {/* Masonry-style testimonial grid with parallax effect */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials
              .filter((_, index) => index !== activeIndex)
              .map((testimonial, index) => {
                // Calculate parallax offset based on idx for more natural movement
                const offset = scrollY * (0.05 + (index % 5) * 0.015);

                return (
                  <div
                    key={index}
                    className="transform transition-all duration-500"
                    style={{
                      transform: `translateY(${offset}px)`,
                      opacity: 1 - (index % 5) * 0.05,
                      zIndex: testimonials.length - index,
                    }}
                  >
                    <TestimonialCard
                      text={testimonial.text}
                      author={testimonial.author}
                      role={testimonial.role}
                      rating={testimonial.rating}
                      image={testimonial.image}
                      onClick={() => {
                        setActiveIndex(
                          testimonials.findIndex(
                            (t) => t.author === testimonial.author
                          )
                        );
                        setIsAutoPlaying(false);
                      }}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
