import {
  Audience,
  audienceFromString,
  EventActivityType,
  eventActivityTypeFromString,
  levelFromString,
  RecurringMeetings,
  Skill,
  SOSDate,
  TeachActivityType,
  teachActivityTypeFromString,
  Topic,
  UserShort
} from "./shared";


export interface DataImage {
  extension: string
  url: string | null
  data: string | null
}

export interface Image extends DataImage {
  id: number
}

export interface ImageGallery {
  id: number
  name?: string
  images: Image[]
}


export type ActivityType = "teach" | "event" | "research"

export interface Activity {
  id: number,
  language: string,
  type: ActivityType,
  title: string,
  coverPic: DataImage,
  gallery: ImageGallery,
  topics: Topic[]
  description: string,
  deadline: Date | null,
  bazaarIdeaId: number,
  createdAt?: Date,
  updatedAt?: Date,
  favorite?: boolean | null
}

export interface ActivityResearchApp {
  userId: number,
  motivation?: string,
  createdAt: Date
}

export interface ActivityResearchAppFull {
  user: UserShort,
  motivation?: string,
  createdAt: Date
}

export interface ActivityResearchRole {
  id: number,
  people: number,
  skills: Skill[],
  applications?: ActivityResearchAppFull[],
  application?: ActivityResearchApp
}

export interface ActivityResearch extends Activity {
  organizationName: string | null,
  motivation: string,
  valueDetails: string,
  startDate: Date,
  duration: number,
  roles: ActivityResearchRole[],
  userHasAccess?: boolean
}

export type ActivitySchedule = RecurringMeetings | {
  totalDays: number,
  totalHours: number
}

export interface ActivityGuest {
  id: number,
  userId: number | null,
  firstName: string,
  lastName: string,
  title: string,
  bio?: string
}

export type PaymentMethod = "paypal" | "credit_card" | "wire_transfer"
// noinspection JSUnusedGlobalSymbols
export const PaymentMethods = ["paypal", "credit_card", "wire_transfer"];

export interface ActivitySubscription {
  createdAt: Date,
  paymentMethod: PaymentMethod,
  verified?: boolean | null,
  cro?: string | null,
  transactionId?: string | null,
  amount?: number | null
}

export namespace ActivitySubscription {
  export function fromJson(json: any): ActivitySubscription {
    return json ? {
      createdAt: new Date(json.createdAt),
      paymentMethod: json.paymentMethod,
      verified: json.verified,
      cro: json.cro,
      transactionId: json.transactionId,
      amount: json.amount
    } : null
  }
}

export interface ActivityEvent extends Activity {
  level?: number,
  audience: Audience[],
  outputType: string,
  program: string,
  activityType: EventActivityType | TeachActivityType,
  costs: number | null,
  payments: boolean,
  minParticipants?: number | null,
  maxParticipants?: number | null,
  schedule: ActivitySchedule,
  dates: SOSDate[],
  startDate?: Date,
  guests: ActivityGuest[],
  requiredSkills: Skill[],
  acquiredSkills: Skill[],
  subscription?: ActivitySubscription | null
}

export type TeachCategory = "x" | "y" | "z"

export interface ActivityTeach extends ActivityEvent {
  outputDescription: string,
  teachCategory: TeachCategory
}

export interface PaymentInfoRequest {
  paymentMethod: PaymentMethod,
  referenceId: string,
  amount: number
}


export namespace ActivityEvent {
  export function fromJson(json: any, teach: boolean = false): ActivityEvent {
    return {
      id: json.id,
      language: json.language,
      type: "event",
      title: json.title,
      coverPic: json.coverPic,
      gallery: json.gallery,
      topics: json.topics.map(Topic.fromJson),
      description: json.description,
      deadline: json.deadline ? new Date(json.deadline) : null,
      bazaarIdeaId: json.bazaarIdeaId,
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt),
      favorite: json.favorite,
      level: json.level ? levelFromString(json.level) : null,
      audience: json.audience.map(audienceFromString),
      outputType: json.outputType,
      program: json.program,
      activityType: teach ?
        teachActivityTypeFromString(json.activityType) : eventActivityTypeFromString(json.activityType),
      costs: json.costs,
      payments: json.payments,
      minParticipants: json.minParticipants,
      maxParticipants: json.maxParticipants,
      schedule: json.schedule.type === 'recurring' ?
        RecurringMeetings.fromJson(json.schedule) :
        {
          totalDays: json.schedule.totalDays,
          totalHours: json.schedule.totalHours
        },
      dates: json.dates.map(SOSDate.fromJson),
      startDate: new Date(json.startDate),
      guests: json.guests,
      requiredSkills: json.requiredSkills.map(Skill.fromJson),
      acquiredSkills: json.acquiredSkills.map(Skill.fromJson),
      subscription: ActivitySubscription.fromJson(json.subscription)
    }
  }
}

export namespace ActivityTeach {
  export function fromJson(json: any): ActivityTeach {
    let base = ActivityEvent.fromJson(json, true) as ActivityTeach;
    base.type = "teach";
    base.outputDescription = json.outputDescription;
    base.teachCategory = json.teachCategory;
    return base;
  }
}

export namespace ActivityResearchRole {
  export function fromJson(json: any): ActivityResearchRole {
    let role = json;

    if (role.application)
      role.application.createdAt = new Date(role.application.createdAt);

    if (role.applications) {
      role.applications = role.applications.map(app => {
        app.createdAt = new Date(app.createdAt);
        return app;
      });
    }

    return role;
  }
}

export namespace ActivityResearch {
  export function fromJson(json: any): ActivityResearch {
    return {
      id: json.id,
      language: json.language,
      type: "research",
      title: json.title,
      coverPic: json.coverPic,
      gallery: json.gallery,
      topics: json.topics,
      description: json.description,
      deadline: new Date(json.deadline),
      bazaarIdeaId: json.bazaarIdeaId,
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt),
      favorite: json.favorite,
      organizationName: json.organizationName,
      motivation: json.motivation,
      valueDetails: json.valueDetails,
      startDate: new Date(json.startDate),
      duration: json.duration,
      roles: json.roles.map(ActivityResearchRole.fromJson),
      userHasAccess: json.userHasAccess
    };
  }
}
