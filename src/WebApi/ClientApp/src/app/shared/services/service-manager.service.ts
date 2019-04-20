import {
  Injectable,
  InjectFlags,
  InjectionToken,
  Injector,
  Type
} from '@angular/core';
/**
 * Manage the instance of application services use in business component
 */
@Injectable({
  providedIn: 'root'
})
export class ServiceManager {
  public static injector: Injector;

  /**
   * Retrieves an instance from the injector based on the provided token.
   * If not found:
   * - Throws an error if no `notFoundValue` that is not equal to
   * Injector.THROW_IF_NOT_FOUND is given
   * - Returns the `notFoundValue` otherwise
   */
  public static get<T>(
    token: Type<T> | InjectionToken<T>,
    notFoundValue?: T,
    flags?: InjectFlags
  ): T {
    return ServiceManager.injector.get(token, notFoundValue, flags);
  }
}
