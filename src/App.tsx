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
  const defaultText = "77 68 6f 6f";
  const endpoint = "https://receipt.recurse.com/escpos";
  const token = getCookieValue(document.cookie);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
    const formData = new FormData(e.target);
    const formText = formData.get("text") as string;
    const formBytes = formText.split(' ').map(b => parseInt(b, 16));
    const bytes = [0x1b, 0x40].concat(formBytes, [0x1b, 0x64, 0x06, 0x1d, 0x56, 0x00]);
    const datas = new Uint8Array(bytes);

      const response = await fetch(endpoint, {
        method: "POST",
        body: datas,
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
            <label htmlFor="text">Space-delimited hex values to send:</label>
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
