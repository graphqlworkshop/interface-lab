const { ApolloServer, gql } = require("apollo-server");

const employees = require("./data/employees");

const typeDefs = gql`
  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    job: JobType
    liftOperator_yearsExperience: Int
    skiPatrol_certified: Boolean
    instructor_level: Level
    bartender_assignment: Location
  }

  enum JobType {
    LIFTOPERATOR
    SKIPATROL
    INSTRUCTOR
    BARTENDER
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
    allEmployees(job: JobType): [Employee!]!
    totalEmployees: Int!
  }
`;

const resolvers = {
  Query: {
    allEmployees: (parent, { job }, { employees }) => {
      if (job) {
        return employees.filter(e => e.job === job);
      } else {
        return employees;
      }
    },
    totalEmployees: (parent, args, { employees }) => employees.length
  },
  Employee: {
    liftOperator_yearsExperience: parent => parent.yearsExperience,
    instructor_level: parent => parent.level,
    skiPatrol_certified: parent => parent.certified,
    bartender_assignment: parent => parent.assignment
  }
};

const context = { employees };

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context
});

server.listen().then(({ url }) => console.log(`Server running on ${url}`));
