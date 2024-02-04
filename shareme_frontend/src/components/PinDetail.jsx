import React, { useState, useEffect } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { ThreeDots } from 'react-loader-spinner';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayoutPinDetail from './MasonryLayoutPinDetail';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';

const PinDetail = ({ user }) => {
  const { pinId } = useParams();
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);

        if (data[0]) {
          query = pinDetailMorePinQuery(data[0]);
          client.fetch(query).then((res) => setPins(res));
        }
      });
    }
  };

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: 'postedBy',
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  if (!pinDetail) return <Spinner message="Loading pin..." />;

  return (
    <div className="flex y:flex-row m-10 bg-white flex-col items-center justify-start gap-4">
      <div
        className="flex flex-row m-auto flex-col bg-white mt-5"
        style={{
          maxWidth: '600px',
          borderRadius: '32px',
        }}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetail?.image && urlFor(pinDetail.image).url()}
            className="rounded-t-3xl rounded-b-lg"
            alt="user-post"
          />
        </div>
        <div
          className="w-full p-5 pl-2 pr-2 flex-1"
          style={{ maxWidth: '500px' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              >
                <MdDownloadForOffline className="w-7 h-7" />
              </a>
            </div>
            <a
              href={pinDetail.destination}
              target="_blank"
              rel="noreferrer"
              className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
            >
              <BsFillArrowUpRightCircleFill />

              {pinDetail.destination.slice(8, 12) === 'www.'
                ? `${pinDetail.destination.slice(12, 25)}...`
                : `${pinDetail.destination.slice(8, 21)}...`}
            </a>
          </div>
        </div>
        <h1 className="text-3xl font-bold break-words m-1 mt-3">
          {pinDetail.title}
        </h1>
        <h1 className="m-1 mt-3">{pinDetail.about}</h1>
        <div className="m-1">
          <Link
            to={`user-profile/${pinDetail.postedBy?._id}`}
            className="flex gap-2 mt-4 items-center bg-white rounded-lg"
          >
            <img
              className="w-9 h-9 rounded-full object-cover"
              src={pinDetail.postedBy?.image}
              alt="user-profile"
            />
            <p className="font-semibold capitalize text-lg">
              {pinDetail.postedBy?.userName}
            </p>
          </Link>
          <h2 className="mt-5 text-2xl">Comments</h2>
          <div className="max-h-270 overflow-y-auto">
            {pinDetail?.comments?.map((comment, i) => (
              <div
                className="
            flex gap-2 m-2 mt-5 items-center bg-white rounded-lg"
                key={i}
              >
                <img
                  src={comment.postedBy.image}
                  alt="use-profile"
                  className="w-8 h-8 rounded-full  cursor-pointer"
                />
                <div className="flex flex-col">
                  <p className="font-bold text-sm">
                    {comment.postedBy.userName}
                  </p>
                  <p className="text-base">{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap m-2 mt-6 mb-0 gap-3">
            <Link
              to={`user-profile/${pinDetail.postedBy?._id}`}
              className="flex gap-2 mt-1 mb-1 items-start bg-white rounded-lg"
            >
              <img
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
                src={pinDetail.postedBy?.image}
                alt="user-profile"
              />
            </Link>
            <input
              className="flex-1 border-gray-100 outline-none border-2 rounded-2xl focus:border-gray-300 pl-4 pr-4"
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="button"
              className="bg-red-600 text-white rounded-full px-6 py-2 font-medium text-base outline-none opacity-80 hover:opacity-100 hover:font-bold"
              onClick={addComment}
            >
              {addingComment ? `Posting the commnet...` : 'Post'}
            </button>
          </div>
        </div>
      </div>
      <div
        className="flex flex-col flex-row m-auto items-center mt-3"
        style={{
          maxWidth: '500px',
        }}
      >
        {/* <div className="flex flex-col justify-center items-center w-200">
          <ThreeDots
            type="Circles"
            color="#00BFFF"
            height={50}
            width={100}
            className="m-5"
          /> */}
        {/* <p className="text-lg text-center px-2">"More like that"</p> */}
        {/* <h2 className="text-center font-bold text-2xl mt-4 mb-4">
            "More like that"
          </h2> */}
        {pins?.length > 0 ? (
          <div>
            <h2 className="text-center font-bold text-2xl mt-0 mb-2">
              "More like this"
            </h2>
            <div className="m-2">
              <MasonryLayoutPinDetail pins={pins} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center w-200">
            <ThreeDots
              type="Circles"
              color="#00BFFF"
              height={50}
              width={100}
              className="m-5"
            />
            <p>Loading more pins...</p>
          </div>
        )}
        {/* </div> */}
      </div>
    </div>
  );
};

export default PinDetail;
