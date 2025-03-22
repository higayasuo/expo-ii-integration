import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Storage } from 'expo-storage-universal';
import { DelegationChain, isDelegationValid } from '@dfinity/identity';
import { DelegationChainValueStorageWrapper } from '../DelegationChainValueStorageWrapper';

vi.mock('@dfinity/identity', async () => {
  const actual = await vi.importActual('@dfinity/identity');
  return {
    ...actual,
    isDelegationValid: vi.fn(),
  };
});

describe('DelegationChainValueStorageWrapper', () => {
  let storage: Storage;
  let wrapper: DelegationChainValueStorageWrapper;
  const testKey = 'test-key';
  const mockDelegation = {
    toJSON: vi.fn().mockReturnValue({ key: 'mock-delegation-data' }),
  } as unknown as DelegationChain;

  beforeEach(() => {
    storage = {
      find: vi.fn(),
      save: vi.fn(),
      remove: vi.fn(),
    } as unknown as Storage;

    wrapper = new DelegationChainValueStorageWrapper(storage, testKey);
    vi.spyOn(DelegationChain, 'fromJSON').mockReturnValue(mockDelegation);
    vi.mocked(isDelegationValid).mockReturnValue(true);
  });

  describe('find', () => {
    it('should return undefined when no value is found', async () => {
      vi.mocked(storage.find).mockResolvedValue(undefined);

      const result = await wrapper.find();
      expect(result).toBeUndefined();
    });

    it('should return DelegationChain when value is found and valid', async () => {
      const mockData = { key: 'mock-delegation-data' };
      const storedValue = JSON.stringify(mockData);
      vi.mocked(storage.find).mockResolvedValue(storedValue);

      const result = await wrapper.find();
      expect(result).toBe(mockDelegation);
      expect(DelegationChain.fromJSON).toHaveBeenCalledWith(storedValue);
    });

    it('should return undefined and remove invalid delegation', async () => {
      const mockData = { key: 'mock-delegation-data' };
      const storedValue = JSON.stringify(mockData);
      vi.mocked(storage.find).mockResolvedValue(storedValue);
      vi.mocked(isDelegationValid).mockReturnValue(false);

      const result = await wrapper.find();
      expect(result).toBeUndefined();
      expect(storage.remove).toHaveBeenCalledWith(testKey);
    });
  });

  describe('retrieve', () => {
    it('should return DelegationChain when value exists and is valid', async () => {
      const mockData = { key: 'mock-delegation-data' };
      const storedValue = JSON.stringify(mockData);
      vi.mocked(storage.find).mockResolvedValue(storedValue);

      const result = await wrapper.retrieve();
      expect(result).toBe(mockDelegation);
    });

    it('should throw error when no value is found', async () => {
      vi.mocked(storage.find).mockResolvedValue(undefined);

      await expect(wrapper.retrieve()).rejects.toThrow(
        `No value found for key ${testKey}`,
      );
    });
  });

  describe('save', () => {
    it('should save the DelegationChain value', async () => {
      await wrapper.save(mockDelegation);

      expect(storage.save).toHaveBeenCalledWith(
        testKey,
        JSON.stringify(mockDelegation.toJSON()),
      );
    });
  });

  describe('remove', () => {
    it('should remove the value from storage', async () => {
      await wrapper.remove();

      expect(storage.remove).toHaveBeenCalledWith(testKey);
    });
  });
});
