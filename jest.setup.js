// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// For ensuring that we can use fetch in testing evironment
import 'whatwg-fetch';
import { server } from '@/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
