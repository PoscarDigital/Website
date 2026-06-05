interface Customer {
  id: number;
  name: string;
  logo: string;
  status: number;
  featured?: boolean;
  category?: 'government' | 'education' | 'enterprise';
}

interface CustomerData {
  customers: Customer[];
}

interface Testimonial {
  id: number;
  name: string;
  position: string;
  organization: string;
  image: string;
  quote: string;
  status: number;
  product?: string;
}

interface TestimonialData {
  testimonials: Testimonial[];
}

declare module '*/customers.json' {
  const data: CustomerData;
  export default data;
}

declare module '*/testimonial.json' {
  const data: TestimonialData;
  export default data;
}
