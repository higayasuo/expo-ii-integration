import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StringValueStorageWrapper } from 'expo-storage-universal';
import { saveRedirectPath } from '../saveRedirectPath';

describe('saveRedirectPath', () => {
  const redirectPathStorage = {
    save: vi.fn().mockResolvedValue(undefined),
    remove: vi.fn().mockResolvedValue(undefined),
  } as unknown as StringValueStorageWrapper;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should save redirectPath when provided with a path', async () => {
    const redirectPath = '/dashboard';
    const currentPath = '/login';

    await saveRedirectPath({
      loginOuterParams: { redirectPath },
      currentPath,
      redirectPathStorage,
    });

    expect(redirectPathStorage.save).toHaveBeenCalledWith(redirectPath);
    expect(redirectPathStorage.remove).not.toHaveBeenCalled();
  });

  it('should remove redirectPath when provided as empty string', async () => {
    const redirectPath = '';
    const currentPath = '/login';

    await saveRedirectPath({
      loginOuterParams: { redirectPath },
      currentPath,
      redirectPathStorage,
    });

    expect(redirectPathStorage.remove).toHaveBeenCalled();
    expect(redirectPathStorage.save).not.toHaveBeenCalled();
  });

  it('should remove redirectPath when redirectPath is undefined', async () => {
    const currentPath = '/login';

    await saveRedirectPath({
      loginOuterParams: { redirectPath: undefined },
      currentPath,
      redirectPathStorage,
    });

    expect(redirectPathStorage.remove).toHaveBeenCalled();
    expect(redirectPathStorage.save).not.toHaveBeenCalled();
  });

  it('should save currentPath when redirectPath is not provided', async () => {
    const currentPath = '/login';

    await saveRedirectPath({
      loginOuterParams: {},
      currentPath,
      redirectPathStorage,
    });

    expect(redirectPathStorage.save).toHaveBeenCalledWith(currentPath);
    expect(redirectPathStorage.remove).not.toHaveBeenCalled();
  });
});
