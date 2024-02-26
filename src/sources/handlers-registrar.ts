import { SourceHandler } from './source-handler';
import { LinkedInSourceHandler } from './linkedin';
import { YCombinatorSourceHandler } from './ycombinator';
import { IndeedSourceHandler } from './indeed';
import { GlassDoorSourceHandler } from './glassdoor';

export const registeredHandlers: SourceHandler[] = [
  new LinkedInSourceHandler(),
  new YCombinatorSourceHandler(),
  new IndeedSourceHandler(),
  new GlassDoorSourceHandler(),
];