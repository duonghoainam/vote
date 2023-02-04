import '@/styles/globals.css'
import { VotingProvider } from "../context/Voter";
import NavBar from "../components/NavBar/NavBar";

export default function App({ Component, pageProps }) {
  return <VotingProvider>
  <div>
    <NavBar />
    <div>
      <Component {...pageProps} />
    </div>
  </div>
</VotingProvider>
}
