const Testimonials = () => {
  return (
    <div className="testimonials-section bg-gray-100 p-4 md:p-6 rounded-lg mb-4 md:mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-700 mb-4 md:mb-6">
        What Our Users Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Testimonial 1 */}
        <div className="testimonial p-4 rounded-lg shadow-md hover:scale-105 transition-transform duration-200">
          <p className="text-gray-600 mb-2">
            &quot;This system has transformed the way we manage our properties.
            Highly recommended!&quot;
          </p>
          <p className="text-gray-700 font-semibold">
            - Jane Doe, Property Manager
          </p>
        </div>

        {/* Testimonial 2 */}
        <div className="testimonial p-4 rounded-lg shadow-md hover:scale-105 transition-transform duration-200">
          <p className="text-gray-600 mb-2">
            &quot;User-friendly and efficient. It&apos;s everything we needed
            for our property portfolio.&quot;
          </p>
          <p className="text-gray-700 font-semibold">
            - John Smith, Real Estate Investor
          </p>
        </div>

        {/* Testimonial 3 */}
        <div className="testimonial p-4 rounded-lg shadow-md hover:scale-105 transition-transform duration-200">
          <p className="text-gray-600 mb-2">
            &quot;The analytics and reporting features are top-notch. A
            game-changer for property management.&quot;
          </p>
          <p className="text-gray-700 font-semibold">
            - Sarah Johnson, Developer
          </p>
        </div>

        {/* Testimonial 4 */}
        <div className="testimonial p-4 rounded-lg shadow-md hover:scale-105 transition-transform duration-200">
          <p className="text-gray-600 mb-2">
            &quot;Absolutely love the tenant communication tools. It makes
            everything so much smoother.&quot;
          </p>
          <p className="text-gray-700 font-semibold">
            - Michael Brown, Landlord
          </p>
        </div>

        {/* Testimonial 5 */}
        <div className="testimonial p-4 rounded-lg shadow-md hover:scale-105 transition-transform duration-200">
          <p className="text-gray-600 mb-2">
            &quot;Incredible support and user interface. It has streamlined our
            workflows significantly.&quot;
          </p>
          <p className="text-gray-700 font-semibold">
            - Emily White, Property Manager
          </p>
        </div>

        {/* Testimonial 6 */}
        <div className="testimonial p-4 rounded-lg shadow-md hover:scale-105 transition-transform duration-200">
          <p className="text-gray-600 mb-2">
            &quot;Cost-effective and robust. It has all the features we need and
            more.&quot;
          </p>
          <p className="text-gray-700 font-semibold">
            - Alex Green, Real Estate Agent
          </p>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
