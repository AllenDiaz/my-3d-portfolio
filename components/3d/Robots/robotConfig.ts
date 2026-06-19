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
];
