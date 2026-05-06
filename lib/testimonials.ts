// To add a testimonial, push an object: { quote: '...', name: '...', location: '...', date: '...' }.

export type Testimonial = {
  quote: string;
  name: string;
  location: string;
  date: string;
};

export const TESTIMONIALS: Testimonial[] = [];
