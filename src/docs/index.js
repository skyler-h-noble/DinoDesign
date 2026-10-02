// src/docs/index.ts
//
// The written reference for each component — what its props mean, how it is
// themed, which tokens it reads, and the mistakes it invites. This lived in the
// studio, where only the studio could read it; it belongs here, beside the
// components it describes, so the gallery can show it and a consumer's agent
// can import it instead of inferring from prop names.
export * from './componentDoc';
export * from './components';
export * from './foundations';
export * from './docsLink';
export { EXAMPLES, hasExample } from './examples';
