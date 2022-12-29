import { VscGithub } from "react-icons/vsc";

export function Github() {
  return (
    <a
      rel="noreferrer"
      className="github"
      href="https://github.com/hjoelh/Jira-Ticket-Bot"
      target="_blank"
      aria-label="GitHub"
      style={{
        color: "black",
        fontSize: "45px",
        position: "fixed",
        bottom: "20px",
        left: "23px",
      }}
    >
      <VscGithub />
    </a>
  );
}
