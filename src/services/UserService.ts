import { RouteError } from '@src/common/classes';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

import UserRepo from '@src/repos/UserRepo';
import { IUser } from '@src/models/User';
import featureService from '@src/flags';


// **** Variables **** //

export const USER_NOT_FOUND_ERR = 'User not found';


// **** Functions **** //

/**
 * Get all users.
 */
function getAll(): Promise<IUser[]> {
  return UserRepo.getAll();
}

/**
 * Add one user.
 */
function addOne(user: IUser): Promise<void> {
  const allowSignups = featureService.isEnabled('allowSignups');
  if (!allowSignups) {
    throw new RouteError(
      HttpStatusCodes.FORBIDDEN,
      'Signups are not allowed',
    );
  }
  return UserRepo.add(user);
}

/**
 * Update one user.
 */
async function updateOne(user: IUser): Promise<void> {
  const persists = await UserRepo.persists(user.id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }

  const allowEmailUpdate = featureService.isEnabled('allowEmailUpdate');
  if (!allowEmailUpdate) {
    throw new RouteError(
      HttpStatusCodes.FORBIDDEN,
      'Email update is not allowed',
    );
  }

  // Return user
  return UserRepo.update(user);
}

/**
 * Delete a user by their id.
 */
async function _delete(id: number): Promise<void> {
  const persists = await UserRepo.persists(id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }

  const hardDelete = featureService.isEnabled('hardDeleteUsers');
  if (hardDelete) {
    return UserRepo.delete(id);
  }

  // Soft delete user
  return UserRepo.softDelete(id);
}


// **** Export default **** //

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
} as const;
