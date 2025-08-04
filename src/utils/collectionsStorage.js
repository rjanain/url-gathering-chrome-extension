/**
 * Collections Storage Utility
 * Handles saving, loading, and managing URL collections across all browsers
 */

import { Browser } from './browser.js';

const api = Browser.api.getAPI();

/**
 * Generate a unique ID for collections
 * @returns {string} Unique identifier
 */
export function generateCollectionId() {
    return 'collection_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Get all collections from storage
 * @returns {Promise<Array>} Array of collections
 */
export async function getAllCollections() {
    try {
        const result = await api.storage.sync.get('collections');
        return result.collections || [];
    } catch (error) {
        console.error('Failed to get collections:', error);
        return [];
    }
}

/**
 * Save a new collection
 * @param {Object} collection - Collection object with name, urls, etc.
 * @returns {Promise<boolean>} Success status
 */
export async function saveCollection(collection) {
    try {
        const collections = await getAllCollections();

        const newCollection = {
            id: generateCollectionId(),
            name: collection.name,
            urls: collection.urls || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...collection
        };

        collections.push(newCollection);

        await api.storage.sync.set({ collections });
        console.log('Collection saved successfully:', newCollection.name);
        return newCollection;
    } catch (error) {
        console.error('Failed to save collection:', error);
        return false;
    }
}

/**
 * Update an existing collection
 * @param {string} collectionId - Collection ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<boolean>} Success status
 */
export async function updateCollection(collectionId, updates) {
    try {
        const collections = await getAllCollections();
        const collectionIndex = collections.findIndex(c => c.id === collectionId);

        if (collectionIndex === -1) {
            console.error('Collection not found:', collectionId);
            return false;
        }

        collections[collectionIndex] = {
            ...collections[collectionIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        await api.storage.sync.set({ collections });
        console.log('Collection updated successfully');
        return true;
    } catch (error) {
        console.error('Failed to update collection:', error);
        return false;
    }
}

/**
 * Delete a collection
 * @param {string} collectionId - Collection ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteCollection(collectionId) {
    try {
        const collections = await getAllCollections();
        const filteredCollections = collections.filter(c => c.id !== collectionId);

        await api.storage.sync.set({ collections: filteredCollections });
        console.log('Collection deleted successfully');
        return true;
    } catch (error) {
        console.error('Failed to delete collection:', error);
        return false;
    }
}

/**
 * Reorder collections
 * @param {Array} reorderedCollections - Array of collections in new order
 * @returns {Promise<boolean>} Success status
 */
export async function reorderCollections(reorderedCollections) {
    try {
        // Update the updatedAt timestamp for reordered collections
        const updatedCollections = reorderedCollections.map(collection => ({
            ...collection,
            updatedAt: new Date().toISOString()
        }));

        await api.storage.sync.set({ collections: updatedCollections });
        console.log('Collections reordered successfully');
        return true;
    } catch (error) {
        console.error('Failed to reorder collections:', error);
        return false;
    }
}

/**
 * Get a specific collection by ID
 * @param {string} collectionId - Collection ID
 * @returns {Promise<Object|null>} Collection object or null
 */
export async function getCollectionById(collectionId) {
    try {
        const collections = await getAllCollections();
        return collections.find(c => c.id === collectionId) || null;
    } catch (error) {
        console.error('Failed to get collection:', error);
        return null;
    }
}

/**
 * Create collection from current tabs
 * @param {string} name - Collection name
 * @returns {Promise<Object|boolean>} Created collection or false
 */
export async function createCollectionFromCurrentTabs(name) {
    try {
        const tabs = await api.tabs.query({});
        const urls = tabs.map(tab => ({
            url: tab.url,
            title: tab.title,
            favIconUrl: tab.favIconUrl
        }));

        return await saveCollection({
            name,
            urls,
            source: 'current_tabs'
        });
    } catch (error) {
        console.error('Failed to create collection from current tabs:', error);
        return false;
    }
}
