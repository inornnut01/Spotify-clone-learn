import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { User } from "../models/user.model.js";

export const getStats = async (req, res, next) => {
  try {
    // const totalSong = await Song.countDocuments();
    // const totalAlbum = await Album.countDocuments();
    // const totalUser = await User.countDocuments();

    const [totalSongs, totalAlbums, totalUsers] = await Promise.all([
      Song.countDocuments(),
      Album.countDocuments(),
      User.countDocuments(),

      Song.aggregate([
        {
          $unionWith: {
            coll: "albums",
            pipeline: [],
          },
        },
        {
          $group: {
            _id: "$artist",
          },
        },
        {
          $count: "count",
        },
      ]),
    ]);

    res
      .status(200)
      .json({
        totalSongs,
        totalAlbums,
        totalUsers,
        totalArtists: uniqueArtists[0]?.count || 0,
      });
  } catch (error) {
    console.log("Error in getStats", error);
    next(error);
  }
};
