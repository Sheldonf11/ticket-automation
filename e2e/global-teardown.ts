export default async function globalTeardown() {
  // Test DB is left intact for debugging purposes.
  // Next test run will clean it up via 'db push --force-reset'.
  console.log('Teardown complete. Test database preserved for debugging.');
}
