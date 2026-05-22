import { BUILDER_ARCHETYPES } from '../src/config/constants';
import { supabase } from '../src/tools/supabase';

async function seed() {
  console.log('Seeding archetypes...');
  for (const [id, data] of Object.entries(BUILDER_ARCHETYPES)) {
    await supabase.from('archetypes').insert({ id, ...data });
  }
  console.log('Seed complete.');
}

seed();
