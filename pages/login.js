// pages/login.js
export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/index.html',
      permanent: false,
    },
  };
}

export default function LoginRedirect() {
  return null;
}
