// Next.js Hello World Demo Page
// Visit this page at /hello-world

export default function HelloWorld() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Hello, World! 👋</h1>
      <p style={styles.sub}>This is a Next.js demo page.</p>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "sans-serif",
    background: "#0f0f0f",
    color: "#fff",
  },
  heading: {
    fontSize: "3rem",
    margin: 0,
  },
  sub: {
    marginTop: "1rem",
    color: "#aaa",
    fontSize: "1.2rem",
  },
};
