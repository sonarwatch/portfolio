import { Contract, Service } from '@sonarwatch/portfolio-core';
import { promises as fs } from 'fs';
import * as path from 'node:path';

const PLUGINS_DIR = path.resolve(__dirname, '../../plugins');

export class ServiceDirectory {
  private static singleton: ServiceDirectory;
  private services: Service[];
  private loaded = false;

  private static getSingleton(): ServiceDirectory {
    if (!ServiceDirectory.singleton) {
      ServiceDirectory.singleton = new ServiceDirectory();
    }
    return ServiceDirectory.singleton;
  }

  private constructor() {
    this.services = [];
  }

  private static async load() {
    const singleton = this.getSingleton();
    if (!singleton.loaded) {
      try {
        const serviceFiles = await this.findServiceFiles(PLUGINS_DIR);

        const imports = serviceFiles.map(async (file) => {
          const module = await import(file);
          if (module.services) {
            singleton.addServices(module.services);
            const split = file.split('/');
            console.log(
              `Loaded ${module.services.length} ${
                split[split.length - 2]
              } services`
            );
          }
          return module;
        });

        await Promise.all(imports);
        singleton.loaded = true;
      } catch (error) {
        console.error('Error loading services:', error);
      }
    }

    return singleton;
  }

  addServices(services: Service[]) {
    this.services.push(...services);
  }

  static async getServices() {
    return (await this.load()).services.sort(
      (a, b) => (b.contracts?.length || 0) - (a.contracts?.length || 0)
    );
  }

  static async getContracts() {
    return (await this.load()).services
      .flat()
      .filter((c) => c !== undefined) as unknown as Contract[];
  }

  private static async findServiceFiles(dir: string): Promise<string[]> {
    const serviceFiles: string[] = [];

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          const servicePath = path.join(fullPath, 'services.ts');
          try {
            await fs.access(servicePath);
            serviceFiles.push(servicePath);
          } catch {
            // console.log(`Missing ${servicePath}`);
          }
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dir}:`, error);
    }

    return serviceFiles;
  }
}
