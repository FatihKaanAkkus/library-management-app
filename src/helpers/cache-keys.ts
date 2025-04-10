export const keys = {
  user: {
    index: () => 'users:index',
    show: (id: string) => `user:${id}`,
  },
  book: {
    index: () => 'books:index',
    show: (id: string) => `book:${id}`,
  },
};
