import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Storage } from 'expo-storage-universal';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { Ed25519KeyIdentityValueStorageWrapper } from '../Ed25519KeyIdentityValueStorageWrapper';

describe('Ed25519KeyIdentityValueStorageWrapper', () => {
  let storage: Storage;
  let wrapper: Ed25519KeyIdentityValueStorageWrapper;
  const testKey = 'test-key';
  const mockIdentity = {
    toJSON: vi.fn().mockReturnValue({ key: 'mock-key-data' }),
  } as unknown as Ed25519KeyIdentity;

  beforeEach(() => {
    storage = {
      find: vi.fn(),
      save: vi.fn(),
      remove: vi.fn(),
    } as unknown as Storage;

    wrapper = new Ed25519KeyIdentityValueStorageWrapper(storage, testKey);
    vi.spyOn(Ed25519KeyIdentity, 'fromJSON').mockReturnValue(mockIdentity);
  });

  describe('find', () => {
    it('should return undefined when no value is found', async () => {
      vi.mocked(storage.find).mockResolvedValue(undefined);

      const result = await wrapper.find();
      expect(result).toBeUndefined();
    });

    it('should return Ed25519KeyIdentity when value is found', async () => {
      const mockData = { key: 'mock-key-data' };
      const storedValue = JSON.stringify(mockData);
      vi.mocked(storage.find).mockResolvedValue(storedValue);

      const result = await wrapper.find();
      expect(result).toBe(mockIdentity);
      expect(Ed25519KeyIdentity.fromJSON).toHaveBeenCalledWith(
        JSON.stringify(mockData),
      );
    });
  });

  describe('retrieve', () => {
    it('should return Ed25519KeyIdentity when value exists', async () => {
      const mockData = { key: 'mock-key-data' };
      const storedValue = JSON.stringify(mockData);
      vi.mocked(storage.find).mockResolvedValue(storedValue);

      const result = await wrapper.retrieve();
      expect(result).toBe(mockIdentity);
    });

    it('should throw error when no value is found', async () => {
      vi.mocked(storage.find).mockResolvedValue(undefined);

      await expect(wrapper.retrieve()).rejects.toThrow(
        `No value found for key ${testKey}`,
      );
    });
  });

  describe('save', () => {
    it('should save the Ed25519KeyIdentity value', async () => {
      await wrapper.save(mockIdentity);

      expect(storage.save).toHaveBeenCalledWith(
        testKey,
        JSON.stringify(mockIdentity.toJSON()),
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
