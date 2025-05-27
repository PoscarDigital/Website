interface Customer {
  id: number;
  name: string;
  logo: string;
  status: number;
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
