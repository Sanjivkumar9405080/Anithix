import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/Project';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class ProjectController {
  /**
   * GET /api/projects
   * Returns published projects for public display
   */
  public static getPublishedProjects = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const projects = await Project.find({ status: 'published' })
        .sort({ order: 1, createdAt: -1 })
        .select('-__v')
        .exec();

      sendSuccess(res, 'Published projects retrieved.', { projects });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/projects/:idOrSlug
   * Returns a single published project by id or slug
   */
  public static getPublishedProjectByIdOrSlug = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { idOrSlug } = req.params;

      const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
      const query: any = { status: 'published' };
      if (isObjectId) {
        query.$or = [{ _id: idOrSlug }, { slug: idOrSlug }];
      } else {
        query.slug = idOrSlug.toLowerCase();
      }

      const project = await Project.findOne(query).select('-__v').exec();

      if (!project) {
        sendError(res, 'Project not found.', 404);
        return;
      }

      sendSuccess(res, 'Project details retrieved.', { project });
    } catch (error) {
      next(error);
    }
  };
}
