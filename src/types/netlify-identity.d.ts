interface User {
  id: string;
  // Add other user properties as needed
}

interface NetlifyIdentity {
  on(event: "init", callback: (user: User | null) => void): void;
  on(event: "login", callback: () => void): void;
  // Add other methods as needed
}

interface Window {
  netlifyIdentity: NetlifyIdentity;
}
