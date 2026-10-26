import {
  siJavascript,
  siTypescript,
  siHtml5,
  siCss,
  siTailwindcss,
  siReact,
  siNextdotjs,
  siNodedotjs,
  siExpress,
  siMongodb,
  siClickhouse,
  siRedis,
  siSocketdotio,
  siDocker,
  siJenkins,
  siGit,
  siPm2,
  siLangchain,
  siLanggraph,
  siCrewai,
  siModelcontextprotocol,
  siClaude,
  siDatabricks,
} from 'simple-icons'

export type TechKey = {
  name: string
  quip: string
  /** SVG path (24x24 viewBox). When missing, `label` is drawn as text instead. */
  path?: string
  label: string
  letter: string
}

const letters = 'qwertyuiopasdfghjklzxcvbn'

// 25 keys fill the 5x5 board. Everything here comes from the resume's skills list.
const raw: Omit<TechKey, 'letter'>[] = [
  { name: 'JavaScript', quip: 'ES6+ and the language that runs everything', path: siJavascript.path, label: 'JS' },
  { name: 'TypeScript', quip: 'JavaScript that reads the instructions first', path: siTypescript.path, label: 'TS' },
  { name: 'HTML', quip: 'the skeleton nobody sees until it breaks', path: siHtml5.path, label: 'HTML' },
  { name: 'CSS', quip: 'centering a div, still a daily adventure', path: siCss.path, label: 'CSS' },
  { name: 'Tailwind', quip: 'responsive UI without leaving the markup', path: siTailwindcss.path, label: 'TW' },
  { name: 'React', quip: 'state goes up, bugs come down', path: siReact.path, label: 'React' },
  { name: 'Next.js', quip: 'React with a very organised filing cabinet', path: siNextdotjs.path, label: 'Next' },
  { name: 'Node.js', quip: 'one thread, endless callbacks, surprisingly fast', path: siNodedotjs.path, label: 'Node' },
  { name: 'Express', quip: 'REST APIs with big middleware energy', path: siExpress.path, label: 'ex' },
  { name: 'MongoDB', quip: 'documents first, schemas when you need them', path: siMongodb.path, label: 'Mongo' },
  { name: 'ClickHouse', quip: 'scans a billion log rows before your coffee cools', path: siClickhouse.path, label: 'CH' },
  { name: 'Redis', quip: 'memory so fast it forgets to be persistent', path: siRedis.path, label: 'Redis' },
  { name: 'Socket.IO', quip: 'real-time, no refresh needed', path: siSocketdotio.path, label: 'WS' },
  { name: 'BullMQ', quip: 'job queues that keep the slow work off the request', label: 'BullMQ' },
  { name: 'Docker', quip: 'it works on my machine, now on yours too', path: siDocker.path, label: 'Docker' },
  { name: 'AWS', quip: 'cloud buffet, watch the bill before you fill your plate', label: 'aws' },
  { name: 'Jenkins', quip: 'CI/CD that babysits every deploy', path: siJenkins.path, label: 'CI' },
  { name: 'Git', quip: 'time travel for code, with merge plot twists', path: siGit.path, label: 'Git' },
  { name: 'PM2', quip: 'keeps Node processes alive when they would rather not be', path: siPm2.path, label: 'PM2' },
  { name: 'LangChain', quip: 'chains of prompts, tools and a little hope', path: siLangchain.path, label: 'LC' },
  { name: 'LangGraph', quip: 'agents as graphs, with loops you can reason about', path: siLanggraph.path, label: 'LG' },
  { name: 'CrewAI', quip: 'a small team of agents with job titles', path: siCrewai.path, label: 'Crew' },
  { name: 'MCP', quip: 'one protocol so models can plug into tools', path: siModelcontextprotocol.path, label: 'MCP' },
  { name: 'Claude', quip: 'Claude Code and Agent Skills in the daily loop', path: siClaude.path, label: 'AI' },
  { name: 'Databricks', quip: 'certified in Generative AI, one lakehouse at a time', path: siDatabricks.path, label: 'DB' },
]

export const techKeys: TechKey[] = raw.map((k, i) => ({ ...k, letter: letters[i] }))
