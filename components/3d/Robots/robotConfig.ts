/**
 * Per-robot configuration for the ambient service robots ("Allen's agents").
 *
 * Data only — no geometry, no React. `home` is the static-tier resting spot and
 * the patrol start; `waypoints`/`serveTarget` are consumed by the Phase 4
 * behavior state machine and are unused while robots are static (Phase 3).
 *
 * All floor positions deliberately avoid the desk/avatar footprint
 * (roughly x ∈ [-1.8, 1.8], z ∈ [-2.9, -0.2]).
 */

export type Vec3 = [number, number, number];

export interface RobotConfig {
  /** Stable key, e.g. "agent-01". */
  id: string;
  /** Display designation, e.g. "Agent-01". */
  designation: string;
  /** Resting position on the floor (y = 0) + patrol start. */
  home: Vec3;
  /** Initial facing (radians) while idle/static. */
  homeYaw: number;
  /** Teal/cyan accent + visor emissive color (cohesive with the BinaryWall neon). */
  accent: string;
  /** Flavor: what this agent is "doing". */
  task: string;
  /** Flavor: fake uptime string for the RobotModal. */
  uptime: string;
  /** Phase 4: closed patrol loop (last waypoint connects back to the first). */
  waypoints: Vec3[];
  /** Phase 4: point near Allen's chair the robot visits when "serving". */
  serveTarget: Vec3;
  /** Phase 4: travel speed in units/sec along the path. */
  speed: number;
  /** Phase 5: this robot has a charging dock at its home and returns there to "charge" after serving. */
  usesDock?: boolean;
}

export const ROBOT_CONFIGS: readonly RobotConfig[] = [
  {
    id: 'agent-01',
    designation: 'Agent-01',
    home: [3.2, 0, 1.4],
    homeYaw: -Math.PI / 2,
    accent: '#22d3ee',
    task: 'Indexing repo embeddings',
    uptime: '14d 06h 22m',
    waypoints: [
      [3.2, 0, 1.4],
      [3.2, 0, 4.5],
      [-3.0, 0, 4.5],
      [-3.0, 0, 1.4],
    ],
    serveTarget: [-1.4, 0, 0.4],
    speed: 0.65,
    usesDock: true,
  },
  {
    id: 'agent-02',
    designation: 'Agent-02',
    home: [-3.8, 0, 2.6],
    homeYaw: Math.PI / 3,
    accent: '#2dd4bf',
    task: 'Streaming tokens to monitor 2',
    uptime: '06d 18h 41m',
    waypoints: [
      [-3.8, 0, 2.6],
      [-5.2, 0, 5.5],
      [2.0, 0, 6.2],
      [2.0, 0, 3.0],
    ],
    serveTarget: [-1.2, 0, 0.6],
    speed: 0.55,
  },
  {
    id: 'agent-03',
    designation: 'Agent-03',
    home: [4.6, 0, -1.6],
    homeYaw: Math.PI,
    accent: '#34d399',
    task: 'Running the nightly eval suite',
    uptime: '02d 03h 09m',
    waypoints: [
      [4.6, 0, -1.6],
      [5.4, 0, 3.0],
      [4.2, 0, 6.0],
      [6.0, 0, 6.0],
    ],
    serveTarget: [1.2, 0, 0.6],
    speed: 0.6,
  },
  {
    id: 'agent-04',
    designation: 'Agent-04',
    home: [-5.6, 0, 3.2],
    homeYaw: -Math.PI / 4,
    accent: '#38bdf8',
    task: 'Summarizing the standup notes',
    uptime: '21d 11h 50m',
    waypoints: [
      [-5.6, 0, 3.2],
      [-6.6, 0, 6.2],
      [-2.6, 0, 6.8],
      [-2.2, 0, 3.4],
    ],
    serveTarget: [-2.0, 0, -0.2],
    speed: 0.5,
  },
  {
    id: 'agent-05',
    designation: 'Agent-05',
    home: [5.6, 0, 2.4],
    homeYaw: (Math.PI * 3) / 4,
    accent: '#5eead4',
    task: 'Watching the CI pipeline',
    uptime: '09d 02h 14m',
    waypoints: [
      [5.6, 0, 2.4],
      [6.6, 0, 6.2],
      [2.6, 0, 6.8],
      [2.2, 0, 2.6],
    ],
    serveTarget: [1.6, 0, -0.1],
    speed: 0.75,
  },
  {
    id: 'agent-06',
    designation: 'Agent-06',
    home: [0.2, 0, 6.8],
    homeYaw: 0,
    accent: '#a3e635',
    task: 'Triaging the issue backlog',
    uptime: '01d 19h 03m',
    waypoints: [
      [0.2, 0, 6.8],
      [-2.4, 0, 8.2],
      [2.6, 0, 8.2],
      [0.4, 0, 5.2],
    ],
    serveTarget: [0.2, 0, 0.2],
    speed: 0.68,
  },
  {
    id: 'agent-07',
    designation: 'Agent-07',
    home: [-6.9, 0, 1.0],
    homeYaw: -Math.PI / 6,
    accent: '#67e8f9',
    task: 'Generating unit tests',
    uptime: '04d 07h 38m',
    waypoints: [
      [-6.9, 0, 1.0],
      [-7.6, 0, 4.6],
      [-4.4, 0, 5.0],
      [-4.0, 0, 1.4],
    ],
    serveTarget: [-2.2, 0, 0.0],
    speed: 0.62,
  },
  {
    id: 'agent-08',
    designation: 'Agent-08',
    home: [7.0, 0, 1.0],
    homeYaw: (Math.PI * 7) / 6,
    accent: '#86efac',
    task: 'Profiling the render loop',
    uptime: '12d 23h 05m',
    waypoints: [
      [7.0, 0, 1.0],
      [7.8, 0, 4.6],
      [4.4, 0, 5.0],
      [4.0, 0, 1.2],
    ],
    serveTarget: [1.8, 0, 0.0],
    speed: 0.72,
  },
];
