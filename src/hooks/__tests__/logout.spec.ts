import { describe, it, expect, vi } from 'vitest';
import { logout } from '../logout';
import { DelegationStorage } from '../../storage/DelegationStorage';

describe('logout', () => {
  it('should remove delegation from storage and call onFinally', async () => {
    const delegationStorage = {
      remove: vi.fn().mockResolvedValue(undefined),
    } as unknown as DelegationStorage;
    const onFinally = vi.fn();

    await logout({ delegationStorage, onFinally });

    expect(delegationStorage.remove).toHaveBeenCalled();
    expect(onFinally).toHaveBeenCalled();
  });

  it('should call onFinally and throw error when delegation removal fails', async () => {
    const error = new Error('Delegation removal failed');
    const delegationStorage = {
      remove: vi.fn().mockRejectedValue(error),
    } as unknown as DelegationStorage;
    const onFinally = vi.fn();

    await expect(logout({ delegationStorage, onFinally })).rejects.toThrow(
      error,
    );
    expect(onFinally).toHaveBeenCalled();
  });
});
