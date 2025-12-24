/**
 * Optimize Cloudinary image URLs with transformations
 * @param {string} url - Original Cloudinary URL
 * @param {object} options - Transformation options
 * @returns {string} Optimized URL
 */
export function optimizeCloudinaryUrl(url, options = {}) {
    if (!url || !url.includes('cloudinary.com')) return url;

    const {
        width = 800,
        quality = 'auto',
        format = 'auto'
    } = options;

    // Insert transformations into Cloudinary URL
    const transformation = `w_${width},q_${quality},f_${format}`;
    return url.replace('/upload/', `/upload/${transformation}/`);
}
