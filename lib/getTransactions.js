export async function getTransactions(email) {
  const res = await fetch(
    "https://binaryp2p.sytes.net/api/wallet/getAllTransactions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    }
  );
  const data = await res.json();

  const info = {
    transactions: data.transactions,
    UID: data.UID,
  };

  if (res.status === 200) {
    return info;
  } else {
    return "No transactions found";
  }
}
