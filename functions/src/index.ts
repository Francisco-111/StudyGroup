import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const bucket = admin.storage().bucket();

exports.deleteFileFromStorage = functions.firestore
  .document('groups/{groupId}/files/{fileId}')
  .onDelete(async (snap, context) => {
    const fileData = snap.data();
    if (!fileData || !fileData.name) {
      console.log('No file data or name found, skipping delete.');
      return;
    }

    const filePath = `groups/${context.params.groupId}/files/${fileData.name}`;

    console.log(`Attempting to delete file at path: ${filePath}`);

    try {
      const fileExists = await bucket.file(filePath).exists();
      console.log(`File exists: ${fileExists[0]}`);

      if (fileExists[0]) {
        await bucket.file(filePath).delete();
        console.log(`Successfully deleted file: ${filePath}`);
      } else {
        console.log(`File not found at path: ${filePath}`);
      }
    } catch (error) {
      console.error(`Failed to delete file: ${filePath}`, error);
    }
  });
exports.deleteGroupDataOnZeroMembers = functions.firestore
  .document('groups/{groupId}')
  .onUpdate(async (change, context) => {
    const groupId = context.params.groupId;
    const newData = change.after.data();
    const members = newData.members || [];

    if (members.length === 0) {
      // Delete files
      const filesRef = admin.firestore().collection(`groups/${groupId}/files`);
      const filesSnapshot = await filesRef.get();
      // @ts-ignore
      const deleteFilePromises: (Promise<admin.firestore.WriteResult> | Promise<[Response<any>]>)[] = [];
      filesSnapshot.forEach(doc => {
        deleteFilePromises.push(filesRef.doc(doc.id).delete());
        deleteFilePromises.push(admin.storage().bucket().file(`groups/${groupId}/files/${doc.id}`).delete());
      });

      // Delete messages
      const messagesRef = admin.firestore().collection(`groups/${groupId}/messages`);
      const messagesSnapshot = await messagesRef.get();
      const deleteMessagePromises: Promise<admin.firestore.WriteResult>[] = [];
      messagesSnapshot.forEach(doc => {
        deleteMessagePromises.push(messagesRef.doc(doc.id).delete());
      });

      // Delete schedule
      const scheduleRef = admin.firestore().collection(`groups/${groupId}/schedule`);
      const scheduleSnapshot = await scheduleRef.get();
      const deleteSchedulePromises: Promise<admin.firestore.WriteResult>[] = [];
      scheduleSnapshot.forEach(doc => {
        deleteSchedulePromises.push(scheduleRef.doc(doc.id).delete());
      });

      // Delete the group document itself if needed
      const deleteGroupDocPromise = admin.firestore().doc(`groups/${groupId}`).delete();

      // Await all deletions
      await Promise.all([...deleteFilePromises, ...deleteMessagePromises, ...deleteSchedulePromises, deleteGroupDocPromise]);
    }
  });
