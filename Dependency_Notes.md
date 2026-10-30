# Dependency notes

The API targets .NET 10, using the project-local SDK 10.0.402. Identity and EF Core direct dependencies are pinned to 10.0.13. System.Security.Cryptography.Pkcs is explicitly pinned to 10.0.13 to remove vulnerability findings from an older transitive dependency. Exact dependency graphs are in the checked-in lockfiles.

Frontend: React, React DOM, TypeScript, Vite, the React Vite plugin, Lucide React, Oxlint, Playwright, Prettier, Konva and react-konva. These projects use MIT or Apache-2.0 licences; Lucide icons use the ISC licence. .NET/ASP.NET Core/EF Core use MIT licensing. Refer to the installed package's licence file for exact notices and transitive dependencies; this note is not a complete redistribution audit. The frontend uses system fonts and no remote image/font service. The recce/editor bundle is loaded when opening a survey rather than during initial login.

SQL Server/LocalDB is separately licensed Microsoft software already installed on this machine. SQL Server binaries are not part of this repository. Third-party runtime/tool binaries, npm modules and local SDK/cache files are ignored rather than committed.

Keep dependency audit enabled, review updates and rerun workflow checks after upgrades. No paid UI, PDF, mapping or AI service was introduced.

The media update adds Photo Sphere Viewer core and its markers plugin (MIT), with Three.js as a dependency (MIT), for supplied equirectangular panoramas. Exact versions are locked in src/web/package-lock.json. The 360° bundle is loaded separately and is larger than Vite's default 500 kB chunk warning threshold; it is not downloaded for initial login or ordinary recce capture. No panorama stitching, speech-to-text, paid capture SDK or external file-sharing service was added.
