const resolvers = {
  Query: {
    book: (_, {}, context) => {
      console.log(context);
      return "Hey Working...";
    },
  },
  Mutation: {},
};

export { resolvers };
