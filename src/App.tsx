import ollie from "./assets/ollie.png";
import "./App.css";

function getCookieValue(cookie: string): string {
  return (
    cookie
      .split("; ")
      .find((row) => row.startsWith("receipt_csrf="))
      ?.split("=")[1] || ""
  );
}

function App() {
  const defaultText = "hello printer";
  const endpoint = "https://receipt.recurse.com/escpos";
  const token = getCookieValue(document.cookie);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
 const testbytes = new Uint8Array([0x1b, 0x40, 0x48, 0x45, 0x4c, 0x4c, 0x4f, 0x1b, 0x64, 0x06, 0x1d, 0x56, 0x00]);

      const response = await fetch(endpoint, {
        method: "POST",
        body: testbytes,
        credentials: "include",
        headers: { "X-CSRF-Token": token, "Content-Type": "application/octet-stream" },
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      let err = error as Error;
      console.error(err.message);
    }
  };

  return (
    <>
      <h1>Receipt Printer Raw ESC/POS</h1>
      <div className="card">
        <img src={ollie} className="logo" alt="Octopus logo" />
      </div>
      {token ? (
        <div>
          <form onSubmit={onSubmit}>
            <label htmlFor="text">Text to ignore2:</label>
            <textarea
              id="text"
              name="text"
              rows={5}
              cols={33}
              defaultValue={defaultText}
            ></textarea>
            <button type="submit">Print</button>
          </form>
        </div>
      ) : (
        <div>
          <p>
            you are not authenticated.{" "}
            <a href="https://receipt.recurse.com/login">
              log in to receipt printer API
            </a>
          </p>
        </div>
      )}
    </>
  );
}

export default App;
