const { ApolloServer, gql } = require("apollo-server");

const employees = require("./data/employees");

const typeDefs = gql`
  interface Employee {
    id: ID!
    firstName: String!
    lastName: String!
  }

  type Bartender implements Employee {
    id: ID!
    firstName: String!
    lastName: String!
    assignment: Location!
  }

  type LiftOperator implements Employee {
    id: ID!
    firstName: String!
    lastName: String!
    yearsExperience: Int!
  }

  type SkiPatrol implements Employee {
    id: ID!
    firstName: String!
    lastName: String!
    certified: Boolean!
  }

  type Instructor implements Employee {
    id: ID!
    firstName: String!
    lastName: String!
    level: Level
  }

  enum Level {
    LEVELONE
    LEVELTWO
    LEVELTHREE
  }

  enum Location {
    SUMMIT
    ICEBAR
    EDGEDECK
  }

  type Query {
    allEmployees: [Employee!]!
    allBartenders: [Bartender!]!
    allInstructors: [Instructor!]!
    allLiftOperators: [LiftOperator!]!
    allSkiPatrol: [SkiPatrol!]!
    totalEmployees: Int!
  }
`;

const resolvers = {
  Query: {
    allEmployees: (parent, args, { employees }) => employees,
    totalEmployees: (parent, args, { employees }) => employees.length
  },
  Employee: {
    __resolveType: parent => {
      if (parent.assignment) {
        return "Bartender";
      } else if (parent.yearsExperience) {
        return "LiftOperator";
      } else if (parent.certified) {
        return "SkiPatrol";
      } else {
        return "Instructor";
      }
    }
  }
};

const context = { employees };

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context
});

server.listen().then(({ url }) => console.log(`Server running on ${url}`));
