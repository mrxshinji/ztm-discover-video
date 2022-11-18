import jwt from "jsonwebtoken";

export const redirectUser = (context) => {
  const token = context.req ? context.req.cookies.token : null;
  if (!token) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const decoded = jwt.verify(token.toString(), process.env.JWT_SECRET);
  const userId = decoded.issuer;

  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    userId,
    token,
  };
};
