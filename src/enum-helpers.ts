import {
  Audience,
  BazaarIdeaFramework,
  BazaarIdeaFunding,
  EventActivityType,
  Level,
  RecurringEntity,
  TeachActivityType
} from "./shared";


export class EnumHelpersService {

  public static frameworks = BazaarIdeaFramework;
  public static audienceTypes = Audience;
  public static teachActivityTypes = TeachActivityType;
  public static eventActivityTypes = EventActivityType;
  public static levels = Level;
  public static fundingTypes = BazaarIdeaFunding;
  public static recurringEntities = RecurringEntity;

  constructor() { }

  public static enumerateEnum(e): string[] {
    return Object.keys(e).filter(k => isNaN(parseInt(k)));
  }

}
