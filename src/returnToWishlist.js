export function returnBookToWishlist(book) {
  return { ...book, status: 'wishlist', readPages: 0, log: [], dateStarted: '', dateFinished: '' };
}
